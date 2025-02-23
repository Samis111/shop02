import areaData from 'china-area-data'

// 将数据转换为 Element UI Cascader 组件需要的格式
function formatRegionData() {
  const regions = []
  
  // 遍历省份
  Object.keys(areaData['86']).forEach(provinceCode => {
    const province = {
      value: provinceCode,
      label: areaData['86'][provinceCode],
      children: []
    }
    
    // 获取省份下的城市
    const cities = areaData[provinceCode]
    if (cities) {
      Object.keys(cities).forEach(cityCode => {
        const city = {
          value: cityCode,
          label: cities[cityCode],
          children: []
        }
        
        // 获取城市下的区县
        const areas = areaData[cityCode]
        if (areas) {
          Object.keys(areas).forEach(areaCode => {
            city.children.push({
              value: areaCode,
              label: areas[areaCode]
            })
          })
        }
        
        province.children.push(city)
      })
    }
    
    regions.push(province)
  })
  
  return regions
}

export default formatRegionData() 