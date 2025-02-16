package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Common;
import com.it.domain.Result;
import com.it.domain.User;
import com.it.service.CommonService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("Common")
@RestController
public class CommonController {


    @Autowired
    private CommonService userService;

    @RequestMapping("list")
    public Result list() {

        List<Common> list = userService.list();
        return Result.ok(list);
    }

    @RequestMapping("find/{Uid}")
    public Result find(@PathVariable("Uid") Integer Uid) {

        Common byId = userService.getById(Uid);

        return Result.ok(byId);
    }

    /**
     * 获取一组聊天信息
     * @param tid
     * @return
     */
    @RequestMapping("CommonFind/{tid}")
    public Result CommonFind(@PathVariable("tid") Integer tid) {

        List<Common> tid1 = userService.list(new QueryWrapper<Common>().eq("tid", tid));


        return Result.ok(tid1);
    }


    @PostMapping("save")
    public Result save(Common user) {
        boolean save = userService.save(user);
        return Result.ok();
    }


    @PostMapping("update")
    public Result update(Common user) {
        boolean update = userService.updateById(user);
        return Result.ok();
    }


    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {

        boolean byId = userService.removeById(id);
        return Result.ok();
    }
}
