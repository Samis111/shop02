package com.it.controller;

import com.it.domain.Result;
import com.it.domain.User;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("user")
@RestController
public class UserController {


    @Autowired
    private UserService userService;

    @RequestMapping("list")
    public Result list() {

        List<User> list = userService.list();
        return Result.ok(list);
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {

        User byId = userService.getById(Uid);

        return Result.ok(byId);
    }

    @PostMapping("save")
    public Result save(User user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(User user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }
}
