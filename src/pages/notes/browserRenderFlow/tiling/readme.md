# 分块（Tiling）

合成线程拿到分层信息后，启动多个分块线程（从线程池中获取，根据浏览器宿主环境的配置不同，线程池的大小也会有所不同），将不同层的渲染指令集分成不同块,得到最后的分块信息。  

分块也是浏览器提高渲染效率的手段。  
它将每一层分成不同的小区域，每个小区域只包含自己区域内的绘制指令，方便后续流程按照一定的算法和优先级先处理某些区域，后处理其他区域。  
例如先处理当前浏览器可视范围内的区域，后处理接近可视范围的区域，最后处理边缘区域等等。  
因为从分块开始，后续的步骤都可以通过多线程进行优化并行处理，且块于块之间没有太多的相互影响