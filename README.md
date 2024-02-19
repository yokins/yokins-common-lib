### 使用方法

```javascript
import { toHumanMoney, toRealMoney, deepCopy } from 'yokins-common-lib';

toHumanMoney(120, 100) // 1.20
toHumanMoney(123456, 100) // 1,234.56

toRealMoney(1.20, 100) // 120
toRealMoney('1,234.56', 100) // 123456


deepCopy([1,2, { a: 1 }]) // 全新对象
```