package com.it.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @TableName config
 */
@TableName(value ="config")
@Data
public class Config implements Serializable {
    /**
     * 
     */
    @TableId
    private Integer id;

    /**
     * 
     */
    private String thiskey;

    /**
     * 
     */
    private String valueurl;

    /**
     * 
     */
    private Date infotime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}