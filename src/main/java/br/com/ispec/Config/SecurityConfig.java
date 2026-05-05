package br.com.ispec.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Recursos públicos
                        .requestMatchers("/", "/index.html", "/pages/**", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()

                        // Clientes — TECNICO não tem acesso
                        .requestMatchers("/clientes/**").hasAnyRole("ADMIN", "FISCAL")

                        // FISCAL não pode deletar clientes
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("ADMIN")

                        // Equipamentos, Localizações, Inspeções, Manutenções — todos acessam
                        .requestMatchers("/equipamentos/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/localizacoes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/inspecoes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/manutencoes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

                        // Relatórios e logs — só ADMIN
                        .requestMatchers("/relatorios/**").hasRole("ADMIN")
                        .requestMatchers("/logs/**").hasRole("ADMIN")

                        // Todo o resto exige autenticação
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/pages/main.html", true)
                        .failureUrl("/pages/login.html?error=true")
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.getWriter().write("Não autenticado.");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.getWriter().write("Acesso negado.");
                        })
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}