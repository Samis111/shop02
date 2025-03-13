package com.it.controller.ex;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Cart;
import com.it.domain.Result;
import com.it.domain.Trappings;
import com.it.service.CartService;
import com.it.service.TrappingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("analytics")
@RestController()
public class analyticsController {

    @Autowired
    private CartService cartService;

    @Autowired
    private TrappingsService trappingsService;

    /**
     * 总共价格   总共数量
     * @return
     */
    @GetMapping("totalAll")
    public Result totalAll() {

        HashMap<String, Object> hashMap = new HashMap<>();

        QueryWrapper<Cart> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("SUM(num*price) as sumprice");
        Map<String, Object> maps1 = cartService.getMap(queryWrapper);
        queryWrapper = new QueryWrapper<>();

        Object sumprice = maps1.get("sumprice");

        queryWrapper.select("SUM(num) as sumnum");

        Map<String, Object> maps2 = cartService.getMap(queryWrapper);

        Object sumnum = maps2.get("sumnum");

        hashMap.put("sumprice", sumprice);
        hashMap.put("sumnum", sumnum);

        return Result.ok(hashMap);
    }


    /**
     * 总计 订单销售
     * @return
     */
    @GetMapping("tidtotal")
    public Result tidtotal(){

        QueryWrapper<Cart> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("tid,SUM(num)  AS num").eq("state",1).groupBy("tid");

        List<Map<String, Object>> map = cartService.listMaps(queryWrapper);

        for (Map<String, Object> h1:map){

            Trappings tid = trappingsService.getById((Integer) h1.get("tid"));
            h1.put("name",tid.getName());
        }
        return Result.ok(map);
    }


    @GetMapping("year")
    public Result year(){

        QueryWrapper<Cart> queryWrapper = new QueryWrapper<>();
        queryWrapper.select(" year(thistime)  AS year,SUM(num* price) AS total").eq("state",1).groupBy("year(thistime)");

        List<Map<String, Object>> map = cartService.listMaps(queryWrapper);

        return Result.ok(map);
    }

    @GetMapping("monthly")
    public Result monthly(){

        QueryWrapper<Cart> queryWrapper = new QueryWrapper<>();
        queryWrapper.select(" year(thistime) AS year,month(thistime) AS mont ,SUM(num* price) AS total")
                .eq("state",1).groupBy("year(thistime)").groupBy("month(thistime)");

        List<Map<String, Object>> map = cartService.listMaps(queryWrapper);


        return Result.ok(map);
    }


}
