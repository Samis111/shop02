package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Address;
import com.it.domain.Result;
import com.it.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("address")
@RestController
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping("/{uid}")
    public Result UserFind(@PathVariable("uid") Integer uid) {
        List<Address> list = addressService.list(new QueryWrapper<Address>().eq("uid", uid));
        return Result.ok(list);
    }

    @PostMapping("/save")
    public Result save(@RequestBody Address address) {

        boolean save = addressService.save(address);
        return Result.ok();
    }

    @PutMapping("/update/{id}")
    public Result update(@RequestBody Address address,@PathVariable("id")Integer id) {
        address.setId(id);
        boolean save = addressService.updateById(address);
        return Result.ok();
    }

    @DeleteMapping("/delete/{id}")
    public Result del(@PathVariable("id")Integer id) {

        boolean save = addressService.removeById(id);
        return Result.ok();
    }

}
