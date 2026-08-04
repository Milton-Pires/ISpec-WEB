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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "https://ispec.vercel.app",       // domínio de produção
                "http://localhost:3000"               // dev local
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- ESTAVA FALTANDO
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Preflight do CORS precisa ser liberado explicitamente
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // <-- ADICIONADO

                        // Recursos públicos
                        // (pages/css/js nao sao mais servidos pelo backend --
                        //  pode remover essas linhas quando confirmar que o frontend
                        //  saiu 100% do static/, mas deixar nao quebra nada)
                        .requestMatchers("/", "/index.html", "/pages/**", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/usuarios/me").hasAnyRole("ADMIN", "FISCAL", "TECNICO")
                        .requestMatchers("/usuarios/todos").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

                        // ── Regras específicas ANTES das gerais ──

                        .requestMatchers(HttpMethod.GET, "/usuarios/todos").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

                        // FISCAL não pode deletar clientes
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("ADMIN")

                        //AGENDAMENTO
                        .requestMatchers("/agendamentos/meus").hasAnyRole("ADMIN", "FISCAL", "TECNICO")

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