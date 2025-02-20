package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Result;
import com.it.domain.Type;
import com.it.domain.User;
import com.it.service.TypeService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("Type")
@RestController
public class TypeController {

    @Autowired
    private TypeService userService;

    @RequestMapping("list")
    public Result list() {


        return Result.ok( userService.list());
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {



        return Result.ok(userService.getById(Uid));
    }

    @PostMapping("save")
    public Result save(Type user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    /**
     * 类型限制接口
     *
     * @return
     */
    @RequestMapping("listLimit")
    public Result listLimit() {
        new QueryWrapper<Type>().last("limit 5");
        return Result.ok(userService.list());
    }

    @PostMapping("update")
    public Result update(Type user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

}
