package com.jinchang.wechat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.DigestUtils;
import java.util.ArrayList;

public class CustomAuthenticationProvider implements AuthenticationProvider {

    private UserDetailsService userDetailsService;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public CustomAuthenticationProvider(UserDetailsService userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // 获取认证的用户名 & 密码
        String name = authentication.getName();
        String password = authentication.getCredentials().toString();
        // 认证逻辑
        System.out.println(name);
        System.out.println(password);
        UserDetails userDetails = userDetailsService.loadUserByUsername(name);
        if (null != userDetails) {
            System.out.println("用户存在");
            if (bCryptPasswordEncoder.matches(password, userDetails.getPassword())) {
                // 这里设置权限和角色
                System.out.println("1");
                ArrayList<GrantedAuthority> authorities = new ArrayList<>();
                System.out.println("2");
                authorities.add( new GrantedAuthorityImpl("ROLE_ADMIN"));
                System.out.println("3");
                authorities.add( new GrantedAuthorityImpl("AUTH_WRITE"));
                System.out.println("4");
                // 生成令牌 这里令牌里面存入了:name,password,authorities, 当然你也可以放其他内容
                Authentication auth = new UsernamePasswordAuthenticationToken(name, password, authorities);
                System.out.println("5");
                return auth;
            } else {
                throw new BadCredentialsException("密码错误");
            }
        } else {
            System.out.println("用户不存在");
            throw new UsernameNotFoundException("用户不存在");
        }
    }

    /**
     * 是否可以提供输入类型的认证服务
     * @param authentication
     * @return
     */
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
