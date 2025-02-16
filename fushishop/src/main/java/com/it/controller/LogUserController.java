package com.it.controller;

import com.it.domain.Cart;
import com.it.domain.Loguser;
import com.it.domain.Result;
import com.it.service.CartService;
import com.it.service.LoguserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("LogUser")
@RestController
public class LogUserController {

    @Autowired
    private LoguserService userService;

    @RequestMapping("list")
    public Result list() {


        return Result.ok( userService.list());
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {



        return Result.ok(userService.getById(Uid));
    }

    @PostMapping("save")
    public Result save(Loguser user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(Loguser user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

}
