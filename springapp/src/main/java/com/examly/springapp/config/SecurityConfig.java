// package com.examly.springapp.config;

// import com.examly.springapp.model.User;
// import com.examly.springapp.service.UserService;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/api/users").hasAuthority(User.ROLE_MANAGER)
//                 .requestMatchers("/api/users/**").authenticated()
//                 .anyRequest().permitAll()
//             )
//             .httpBasic(basic -> {});
        
//         return http.build();
//     }

//     @Bean
//     public UserDetailsService userDetailsService(UserService userService) {
//         return email -> {
//             User user = userService.findByEmail(email);
//             if (user == null) {
//                 throw new UsernameNotFoundException("User not found");
//             }
//             return org.springframework.security.core.userdetails.User
//                 .withUsername(user.getEmail())
//                 .password(user.getPassword())
//                 .authorities(user.getRole())
//                 .build();
//         };
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }