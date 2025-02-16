package com.it.controller;

import com.it.domain.Cart;
import com.it.domain.Config;
import com.it.domain.Result;
import com.it.service.CartService;
import com.it.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("home")
@RestController
public class ConfigController {

    @Autowired
    private ConfigService userService;

    @RequestMapping("banners")
    public Result list() {


        return Result.ok(userService.list());
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {



        return Result.ok(userService.getById(Uid));
    }

    @PostMapping("save")
    public Result save(Config user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(Config user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

}
