package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Result;
import com.it.domain.Trappings;
import com.it.domain.Type;
import com.it.service.TrappingsService;
import com.it.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("products")
@RestController
public class TrappingsController {

    @Autowired
    private TrappingsService trappingsService;

    @RequestMapping()
    public Result list(@RequestParam(value = "sort", defaultValue = "") String sort,
                       @RequestParam(value = "limit", defaultValue = "8") String limit
    ) {
        QueryWrapper<Trappings> queryWrapper = new QueryWrapper<>();
        if (sort.equals("new")) {
            queryWrapper.orderByDesc("infotime");
        } else if (sort.equals("sales")) {
            queryWrapper.orderByDesc("price");
        }

        queryWrapper.last("limit " + limit);

        return Result.ok(trappingsService.list(queryWrapper));
    }

    @RequestMapping("{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {


        return Result.ok(trappingsService.getById(Uid));
    }

    @PostMapping("save")
    public Result save(Trappings user) {
        boolean save = trappingsService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(Trappings user) {
        boolean update = trappingsService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = trappingsService.removeById(id);
        return Result.ok();
    }

}
