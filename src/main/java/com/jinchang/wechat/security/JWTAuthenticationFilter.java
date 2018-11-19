package com.jinchang.wechat.security;

import com.jinchang.wechat.entity.AccessToken;
import com.jinchang.wechat.entity.User;
import com.jinchang.wechat.repository.AccessTokenRepository;
import com.jinchang.wechat.repository.UserRepository;
import com.jinchang.wechat.repository.WechatAccessTokenRepository;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import com.jinchang.wechat.exception.TokenException;
import com.jinchang.wechat.service.GrantedAuthorityImpl;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

public class JWTAuthenticationFilter extends BasicAuthenticationFilter {

    protected UserRepository userRepository;

    @Autowired
    protected WechatAccessTokenRepository wechatAccessTokenRepository;

    @Autowired
    protected AccessTokenRepository accessTokenRepository;

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, UserRepository userRepository, AccessTokenRepository accessTokenRepository) {
        super(authenticationManager);
        this.userRepository = userRepository;
        this.accessTokenRepository = accessTokenRepository;

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader("Authorization");
        System.out.print("doFilterInternal\n");
        System.out.print(header+"\n");
        if (header == null) {
            System.out.print("filter");
            chain.doFilter(request, response);
            return;
        }
        UsernamePasswordAuthenticationToken authentication = getAuthentication(request);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        System.out.print("getAuthentication");
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            throw new TokenException("Token为空");
        }
        System.out.println("token");
        System.out.println(token+"\n");
        AccessToken t = null;
        t = accessTokenRepository.findByAccessTokenEqualsAndExpireAfter(token, new Date());
        User u = null;
        if(t != null){
            u = userRepository.findById(t.getUserId());
        }
        if(u != null){
            System.out.println("find u");
            request.setAttribute("currentUserId", u.getId());
            request.setAttribute("currentUdeskId", u.getUdeskId());
        }

        String user = null;
        try {
            user = Jwts.parser()
                    .setSigningKey("MyJwtSecret")
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            if (user != null && t != null) {
                System.out.println("user not null");
                System.out.println(user);
//                String[] split = user.split("-")[1].split(",");
//                ArrayList<GrantedAuthority> authorities = new ArrayList<>();
//                for (int i=0; i < split.length; i++) {
//                    authorities.add(new GrantedAuthorityImpl(split[i]));
//                }
                return new UsernamePasswordAuthenticationToken(user, null, null);
            }
        } catch (ExpiredJwtException e) {
            logger.error("Token已过期: {} " + e);
            throw new TokenException("Token已过期");
        } catch (UnsupportedJwtException e) {
            logger.error("Token格式错误: {} " + e);
            throw new TokenException("Token格式错误");
        } catch (MalformedJwtException e) {
            logger.error("Token没有被正确构造: {} " + e);
            throw new TokenException("Token没有被正确构造");
        } catch (SignatureException e) {
            logger.error("签名失败: {} " + e);
            throw new TokenException("签名失败");
        } catch (IllegalArgumentException e) {
            logger.error("非法参数异常: {} " + e);
            throw new TokenException("非法参数异常");
        }
        return null;
    }


}
