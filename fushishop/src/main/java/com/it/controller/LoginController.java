package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Loguser;
import com.it.domain.Result;
import com.it.domain.User;
import com.it.service.LoguserService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

@RequestMapping("auto")
@RestController
public class LoginController {


    @Autowired
    private UserService userService;

    @Autowired
    private LoguserService loguserService;

    @RequestMapping("login")
    public Result login(@RequestBody User user, HttpSession session) {

        String username = null;
        String password = null;
        try {
            username = user.getUsername();
            password = user.getPassword();

            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", username).eq("password", password);
            List<User> list = userService.list(queryWrapper);
            if (list.size() >= 1) {
                User user1 = list.get(0);
                Loguser loguser = new Loguser();
                loguser.setInfotime(new Date());
                loguser.setNode("登入成功");
                loguser.setUid(user1.getId());
                loguser.setUusername(user1.getUsername());
                loguserService.save(loguser);
                session.setAttribute("info",user1);
                return Result.ok(user1);
            } else {
                Loguser loguser = new Loguser();
                loguser.setInfotime(new Date());
                loguser.setNode("账号密码错误");
                loguser.setUusername(username);
            }
        } catch (Exception e) {
            Loguser loguser = new Loguser();
            loguser.setInfotime(new Date());
            loguser.setNode("登入异常");
            loguser.setUusername(username);
            return Result.fail("登入异常");
        }

        return Result.fail("账号密码不存在");
    }


}
