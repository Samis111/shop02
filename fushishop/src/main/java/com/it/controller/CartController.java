package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Cart;
import com.it.domain.Result;
import com.it.domain.Trappings;
import com.it.service.CartService;
import com.it.service.TrappingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("Cart")
@RestController
public class CartController {

    @Autowired
    private CartService userService;

    @RequestMapping("list")
    public Result list() {


        return Result.ok( userService.list());
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {
        return Result.ok(userService.getById(Uid));
    }

    @RequestMapping("userFind/{uid}")
    public Result userFind(@PathVariable("uid") Integer uid) {
        return Result.ok(userService.list(new QueryWrapper<Cart>().eq("uid",uid).eq("state",0)));
    }

    @PostMapping("save")
    public Result save(@RequestBody  Cart user) {
        user.setState("0");
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(Cart user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

}
