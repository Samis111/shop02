package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.Config;
import com.it.service.ConfigService;
import com.it.mapper.ConfigMapper;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class ConfigServiceImpl extends ServiceImpl<ConfigMapper, Config>
    implements ConfigService{

}




