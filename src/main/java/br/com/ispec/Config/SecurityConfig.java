package br.com.ispec.Config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
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
                .formLogin(form -> form
                        .loginPage("/pages/login.html")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/")
                        .permitAll()
                );

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