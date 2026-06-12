package br.com.ispec.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Recursos públicos
                        .requestMatchers("/", "/index.html", "/pages/**", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()

                        // ── Regras específicas ANTES das gerais ──

                        .requestMatchers(HttpMethod.GET, "/usuarios/todos").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

                        // FISCAL não pode deletar clientes
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("ADMIN")

                        // FISCAL só visualiza equipamentos
                        .requestMatchers(HttpMethod.GET, "/equipamentos/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/equipamentos/**").hasAnyRole("ADMIN", "TECNICO")

                        // TECNICO pode visualizar clientes mas não criar/editar/deletar
                        .requestMatchers(HttpMethod.GET, "/clientes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/clientes/**").hasAnyRole("ADMIN", "FISCAL")

                        // Todos acessam equipamentos, localizações, inspeções, agendamentos, avisos
                        .requestMatchers("/equipamentos/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/localizacoes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/inspecoes/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/agendamentos/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/avisos/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/perguntas-inspecao/**").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

                        // Apenas ADMIN
                        .requestMatchers(HttpMethod.GET, "/usuarios/me").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")
                        .requestMatchers("/relatorios/**").hasRole("ADMIN")
                        .requestMatchers("/logs/**").hasRole("ADMIN")

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