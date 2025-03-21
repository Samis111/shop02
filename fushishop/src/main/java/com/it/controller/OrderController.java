package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Cart;
import com.it.domain.Order;
import com.it.domain.Result;
import com.it.service.CartService;
import com.it.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("order")
@RestController
public class OrderController {


    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @GetMapping("list")
    public Result list() {
        List<Order> list = orderService.list();
        return Result.ok(list);
    }

    @RequestMapping("del/{id}")
    public Result del(@PathVariable("id") Integer id) {
        boolean byId = orderService.removeById(id);
        return Result.ok("删除成功");
    }


    @RequestMapping("save")
    public Result save(@RequestBody Order order) {
        order.setState("0");

        Map<String, Object> map = cartService.getMap(new QueryWrapper<Cart>()
                .select("SUM(price * num) as total")
                .eq("uid", order.getUid())
                .eq("state", 0));

       try {
           order.setCid(map.get("total") +"");

           boolean save = orderService.save(order);
           QueryWrapper<Cart> cartQueryWrapper = new QueryWrapper<>();
           cartQueryWrapper.eq("uid", order.getUid()).eq("state", 0);
           Cart cart = new Cart();
           cart.setState("1");
           cart.setOid(order.getId() + "");
           boolean update = cartService.update(cart, cartQueryWrapper);

           return Result.ok("");
       }catch (Exception e){
           return Result.fail("");
       }
    }

    @RequestMapping("update")
    public Result update(@RequestBody Order order) {
        boolean byId = orderService.updateById(order);
        return Result.ok("");
    }

    @RequestMapping("UserIDOrder/{id}")
    public Result UserIDOrder(@PathVariable("id") Integer id) {
        QueryWrapper<Order> orderQueryWrapper = new QueryWrapper<>();
        orderQueryWrapper.eq("uid", id);
        List<Order> list = orderService.list(orderQueryWrapper);


        for (Order order:list){

            Integer id1 = order.getId();
            QueryWrapper<Cart> eq = new QueryWrapper<Cart>().select("SUM(price * num) AS sum").groupBy("oid").eq("oid", id1);
            Map<String, Object> map = cartService.getMap(eq);

            order.setTotalAmount((Double) map.get("sum"));

        }


        return Result.ok(list);
    }
}
