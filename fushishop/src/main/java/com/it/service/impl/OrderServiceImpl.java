package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.Order;
import com.it.service.OrderService;
import com.it.mapper.OrderMapper;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order>
    implements OrderService{

}




