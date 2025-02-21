package com.it.domain.DTO;

import lombok.Data;

@Data
public class Query {


    private Integer pag = 1;
    private Integer pageSize = 5;

    private String brandId;

    private String sort;

    private Integer minPrice;

    private Integer maxPrice;

}
