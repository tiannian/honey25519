# honey25519

> Some verification implementations for the x25519 scheme algorithm.

## ED25519

- [High-speed high-security signatures](https://ed25519.cr.yp.to/ed25519-20110926.pdf)

## Schemes

| Scheme               | Paper (description)                                          | Status   |
| -------------------- | ------------------------------------------------------------ | -------- |
| Ring Signature       | [Borromean Ring Signature](https://github.com/Blockstream/borromean_paper/raw/master/borromean_draft_0.01_9ade1e49.pdf) | prepared |
| Zero-Knowledge Proof | [Schnorr Non-interactive Zero-Knowledge Proof](https://tools.ietf.org/html/rfc8235) | prepared |
| Multi Signatures     |                                                              | parpared |
| Threshold Signatures | [Douglas R. Stinson, Reto Strobl - Provably Secure Distributed Schnorr Signatures and a (t, n) Threshold Scheme for Implicit Certificates](http://cacr.uwaterloo.ca/techreports/2001/corr2001-13.ps) | parpared |

## Algorithm Details

> 本文中所有出现的变量，小写字母表示标量，大写字母表示离散对数问题中的参数，例如：椭圆曲线中的点。

### Original Schnorr Signature

原始的Schnorr签名是一个交互式的签名机制。允许在任何拥有相同生成元（指在离散对数问题中）的协议参与者双方，证明某一方拥有knowledge $x$ 而不需要直接交换它。其中双方都拥有的生成元设为 $G$ ，证明者拥有随机参数 $x$ ，即私钥。验证者从证明者处取得 $Y$ ，其中 $Y = xG$，$Y$ 即公钥。

Original Schnorr Signature的协议流程如下：

1. 证明者随机选择一个标量 $r_1$，然后计算出 $R = r_1G$。并将 $R$ 发送至验证者。
2. 验证者回应一个随机的标量 $r_2$。
3. 证明者回应一个值$s$，通过公式 $s = r_1 + r_2x$ 计算。

因为离散对数问题是困难的，因此验证者不会知道 $x, r_1$，验证者仅知道由 $x, r_1$计算得到的 $Y, R$。但是验证者可以通过计算来验证$s$是正确的。

- 由于$s = r_1 + r_2x$，等式两边同时添加相同的生成元可得 $sG = r_1G + r_2xG$。
- 由于$R = r_1G$，$Y = xG$，可以化简得到 $sG = R + r_2Y$。

其中 $G$ 是生成元，双方都可知，$R, Y, s, r_2$ 验证者都知道，所以验证者可以轻松验证化简过的公式。

这个过程是零知识的，因为验证者并不能得到私钥 $x$ 的信息，却可以通过计算与通讯的方式验证证明者确实拥有私钥 $x$。

然而这样交互式的过程，会导致验证者通过"fork"的方式获得私钥 $x$。验证者只需要简单的提供两个不同的随机值 $r_2^1, r_2^2$，并要求证明者计算 $s_1 = r_1 + r_2^1x, s_2 = r_1 + r_2^2$，即可计算出$x = (s_1 - s_2)/(r_2^1 - r_2^2)$。这样一来，这个过程便无法公开的验证，因为一旦两个验证者相互串通，交换自己得到的值，便可以推出私钥$x$。

为了解决这个问题后续将采用Random oracles改造这个算法来使Schnorr签名变成可公开验证的非交互式算法。

### Random oracles and Ed25519

随机数预言机，即随机数函数，是一种针对任意输入得到的输出之间是项目独立切均匀分布的函数。理想的随机数预言机并不存在，在视线中，经常采用密码学哈希函数作为随机数预言机。

原本的设计中，Schnorr签名是一种交互式协议，需要一个实际存在的验证者与参与者，而根据Fiat-Shamir转换，可以将具体的验证者采用随机数预言机来代替。将验证者替换为随机数预言机后，外部的验证者便无法通过交换 $r_2$来推出私钥 $x$ ，原本的 $r_2$ 采用随机数预言机产生的随机数来表示。在现有的方案ED25519种，采用了将参数$R$，公钥 $Y$，与消息体 $M$进行哈希作为随机数 $r_2$。具体的ED25519公私钥生成与签名验证的方式如下：

#### 公私钥生成





<script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"> </script>