package com.it.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.DTO.Query;
import com.it.domain.Result;
import com.it.domain.Trappings;
import com.it.service.TrappingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/category/brand")
@RestController
public class NewTrappingsController {


    @Autowired
    private TrappingsService trappingsService;


    @GetMapping("products")
    public Result products(Query query) {

        QueryWrapper<Trappings> queryWrapper = new QueryWrapper<>();
        if (query.getBrandId() != null) {
            queryWrapper.eq("type", query.getBrandId());
        }

        if (query.getMaxPrice() != null &&query.getMaxPrice()!=0 && query.getMinPrice() != null &&query.getMinPrice()!=0) {
            queryWrapper.gt("price", query.getMinPrice()).lt("price", query.getMaxPrice());
        }

        if (!query.getSort().equals("default")) {
            if (query.getSort().equals("price-asc")) {
                queryWrapper.orderByAsc("price");
            } else if (query.getSort().equals("price-desc")) {
                queryWrapper.orderByAsc("price");
            }
        }

        return Result.ok(trappingsService.page(new Page<>(query.getPag(), query.getPageSize()), queryWrapper));
    }

}
