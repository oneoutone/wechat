package com.jinchang.wechat.handle;

import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.naming.AuthenticationException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticaitonFailhandle implements AuthenticationFailureHandler{

    @Override
    public void onAuthenticationFailure(HttpServletRequest var1, HttpServletResponse var2, org.springframework.security.core.AuthenticationException var3) throws IOException, ServletException {
        var2.setHeader("Content-Type", "application/json;charset=utf-8");
        System.out.println(var3.getMessage());
        System.out.println("fkkkkkkk");
        var2.setCharacterEncoding("UTF-8");
        var2.getWriter().write("{\"code\":1,\"message\":\""+var3.getMessage()+"\"}");
        var2.getWriter().flush();

    }
}
