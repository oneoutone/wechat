package com.jinchang.wechat.handle;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest var1, HttpServletResponse var2, AuthenticationException var3) throws IOException, ServletException{

        var2.setStatus(401);
        var2.setHeader("Content-Type", "application/json;charset=utf-8");
        var2.setCharacterEncoding("UTF-8");
        var2.getWriter().write("{\"code\":401,\"message\":\""+var3.getMessage()+"\"}");
        var2.getWriter().flush();
    }


}
