package com.jinchang.wechat.security;

import com.jinchang.wechat.handle.*;
import com.jinchang.wechat.repository.AccessTokenRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.security.JWTAuthenticationFilter;
import com.jinchang.wechat.security.JWTLoginFilter;
import com.jinchang.wechat.service.CustomAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.jinchang.wechat.service.UserDetailsServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.jinchang.wechat.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{
    /**
     * 需要放行的URL
     */
    private static final String[] AUTH_WHITELIST = {
            // -- register url
            "/*.txt",
            "/api/users/signin",
            "/api/util/sendAuthCode",
            "/api/users/wechatAuth",
            "/api/users/wechatBind",
            "/api/users/wechatOpenId",
            "/api/users/accessToken",
            "/webjars/**",
            "/**.html",
            "/**.js",
            "/**.css",
            "/index.html",
            "/assets/**",
            "/libs/**",
            "/",
            "/manager",
            "/manager/**",
            "/manager/access/**",
            "/scripts/**",
            "/views/**",
            "/api/users/hello",
            "/api/users/initAdmin",
            "/api/jobs/notification"
            // other public endpoints of your API may be appended to this array
    };

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private CustomAuthenticaitonFailhandle authenticationFailureHandler;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Autowired
    private CustomLogoutSuccessHandler customLogoutSuccessHandler;

    @Autowired
    private CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @Autowired
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessTokenRepository accessTokenRepository;


    // 设置 HTTP 验证规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        LogoutConfigurer<HttpSecurity> httpSecurityLogoutConfigurer = http.cors().and()
                .exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint)
                .and().csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers(AUTH_WHITELIST).permitAll()
                .anyRequest().authenticated()  // 所有请求需要身份认证
                .and()
                .exceptionHandling().accessDeniedHandler(customAccessDeniedHandler) // 自定义访问失败处理器
                .and()
                .addFilter(new JWTLoginFilter(authenticationManager()))
                .addFilter(new JWTAuthenticationFilter(authenticationManager(), userRepository, accessTokenRepository))
                .formLogin()
                .loginProcessingUrl("/login").permitAll()
                .failureHandler(authenticationFailureHandler) // failure handler
                .successHandler(customAuthenticationSuccessHandler) // success handler
                .and()
                .logout();

    }

    // 该方法是登录的时候会进入
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 使用自定义身份验证组件
        System.out.println("configure");
        auth.authenticationProvider(new CustomAuthenticationProvider(userDetailsService, bCryptPasswordEncoder));
    }
}
