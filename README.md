### 使用方法

```javascript
import {
    toHumanMoney,
    toRealMoney,
    deepCopy,
    generateHttp,
} from "yokins-common-lib";

toHumanMoney(120, 100); // 1.20
toHumanMoney(123456, 100); // 1,234.56

toRealMoney(1.2, 100); // 120
toRealMoney("1,234.56", 100); // 123456

deepCopy([1, 2, { a: 1 }]); // 全新对象

const http = generateHttp(
    "http://www.xxx.cn",
    1000 * 5,
    (config) => {
        config.headers["Authorization"] = "";
    },
    () => {
        alert("错误code");
    },
    () => {
        alert("请求错误");
    }
);
```
