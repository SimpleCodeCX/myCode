import { APITREECONFIG } from './api-tree.config';
import { HOST_URL } from './url';

const APITREE = APITREECONFIG;

/**
 * 为api node chain添加host前缀
 */
const addHost = (apiNodeChain: string) => {
  return apiNodeChain ? `${HOST_URL}/${apiNodeChain.replace(/^\//, '')}` : HOST_URL;
};

/**
 * 根据api tree config 生成 api tree：
 *     为每个api apiNode(api节点)添加host以及所有parentApiNode(父节点)的前缀
 * 举个例子：
 *     以下api tree config中，api节点有v1和user，其中v1是user的父节点
 *     const apiTreeConfig = {
 *       v1: {
 *         user: ''
 *       }
 *     }
 *     ==>
 *     (假设HOST_URL=http://xxx.xxx.xxx.xxx)
 *     const apiTree = {
 *       _this: 'http://xxx.xxx.xxx.xxx',
 *       v1: {
 *         _this: 'http://xxx.xxx.xxx.xxx/v1',
 *         user: 'http://xxx.xxx.xxx.xxx/v1/user'
 *       }
 *     }
 * @param apiTreeConfig api tree config
 * @param parentApiNodeChain parentApiNode1/parentApiNode2/parentApiNode3
 */
const apiTreeGenerator = (apiTreeConfig: string | object, parentApiNodeChain?: string) => {
  for (const key of Object.keys(apiTreeConfig)) {
    const apiNode = key;
    const prefixChain = parentApiNodeChain ? `${parentApiNodeChain}/` : '';
    if (Object.prototype.toString.call(apiTreeConfig[key]) === '[object Object]') {
      apiTreeGenerator(apiTreeConfig[key], prefixChain + apiNode);
    } else {
      apiTreeConfig[key] = parentApiNodeChain
        ? addHost(prefixChain + key)
        : addHost(key);
    }
  }
  // 创建_this节点 (这里需要放在上面的for之后)
  apiTreeConfig['_this'] = parentApiNodeChain
    ? addHost(`${parentApiNodeChain}`)
    : addHost('');
};

apiTreeGenerator(APITREECONFIG);
export { APITREE };
