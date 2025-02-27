package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Cart;
import com.it.domain.Result;
import com.it.domain.Trappings;
import com.it.service.CartService;
import com.it.service.TrappingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("Cart")
@RestController
public class CartController {

    @Autowired
    private CartService userService;

    @Autowired
    private TrappingsService trappingsService;

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

        List<Cart> list = userService.list(new QueryWrapper<Cart>().eq("uid", uid).eq("state", 0));
        for (Cart cart:list){

            Trappings byId = trappingsService.getById(cart.getTid());
            cart.setTrappings(byId);
        }

        return Result.ok(list);
    }

    @PostMapping("save")
    public Result save(@RequestBody  Cart user) {
        user.setState("0");
        List<Cart> list = userService.list(new QueryWrapper<Cart>().eq("uid", user.getUid()).eq("state", 0));
        if (list!=null ){
            Cart cart = list.get(0);
            cart.setNum( cart.getNum()+1);
            userService.updateById(cart);
        }else {
            boolean save = userService.save(user);
        }

        return Result.ok();
    }


    @PostMapping("update")
    public Result update(@RequestBody Cart user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }

}
