package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Result;
import com.it.domain.User;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("users")
@RestController
public class UserController {


    @Autowired
    private UserService userService;

    @RequestMapping("list")
    public Result list(@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();

        if (!keyword.equals("")) {
            queryWrapper.like("name", keyword);
        }

        List<User> list = userService.list(queryWrapper);
        return Result.ok(list);
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {

        User byId = userService.getById(Uid);

        return Result.ok(byId);
    }

    @PostMapping("save")
    public Result save(@RequestBody User user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(@RequestBody User user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

    @PostMapping("/{id}/status")
    public Result status(@PathVariable("id") Integer id) {

        User byId = userService.getById(id);

        if (byId.getState().equals("1")) {
            byId.setState("0");
        } else if (byId.getState().equals("0")) {
            byId.setState("1");
        }

        boolean update = userService.updateById(byId);
        return Result.ok();
    }
}
