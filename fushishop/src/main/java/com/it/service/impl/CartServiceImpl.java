package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.Cart;
import com.it.service.CartService;
import com.it.mapper.CartMapper;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart>
    implements CartService{

}




