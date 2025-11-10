// 全局变量
let currentPageIndex = 0;
let allPages = [];
let isAnimating = false;
let isInitialized = false; // 防止重复初始化

// 检测是否为iOS设备
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
console.log('设备检测: iOS =', isIOS);

// 音乐控制
let isPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');
const musicStatus = document.getElementById('musicStatus');

// 音乐控制功能
function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        musicStatus.textContent = '音乐已暂停';
        isPlaying = false;
    } else {
        bgMusic.play().catch(err => {
            console.log('音乐播放失败:', err);
            musicStatus.textContent = '播放失败';
        });
        musicIcon.textContent = '🎵';
        musicStatus.textContent = '音乐播放中';
        isPlaying = true;
    }
}

// 点击控制按钮切换音乐
if (musicControl) {
    musicControl.addEventListener('click', toggleMusic);
    
    // 鼠标悬停效果
    musicControl.addEventListener('mouseenter', () => {
        musicControl.style.transform = 'scale(1.05)';
    });
    
    musicControl.addEventListener('mouseleave', () => {
        musicControl.style.transform = 'scale(1)';
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 为iOS设备添加特殊类名
    if (isIOS) {
        document.body.classList.add('ios-device');
        console.log('📱 iOS设备：已添加 ios-device 类');
    }
    
    const coverPage = document.getElementById('coverPage');
    const coverContent = document.querySelector('.cover-content');
    const bookContainer = document.getElementById('bookContainer');
    const openBookBtn = document.getElementById('openBookBtn');
    
    // **立即保存所有页面内容**（在DOM还没被修改之前）
    const originalPages = document.querySelectorAll('.page');
    allPages = Array.from(originalPages).map(page => page.innerHTML);
    console.log('✅ 页面加载时保存内容，总页数:', allPages.length);
    
    // 点击封面打开书
    const openBook = () => {
        if (isInitialized) {
            console.log('⚠️ 已经初始化过了，忽略');
            return;
        }
        
        coverPage.classList.add('opening');
        setTimeout(() => {
            coverPage.style.display = 'none';
            bookContainer.style.display = 'block';
            document.getElementById('navContainer').style.display = 'block';
            initBook();
        }, 1200);
    };
    
    openBookBtn.addEventListener('click', openBook);
    coverContent.addEventListener('click', openBook);
});

// 初始化书本
function initBook() {
    if (isInitialized) {
        console.log('⚠️ initBook被重复调用，忽略');
        return;
    }
    
    isInitialized = true;
    console.log('📚 初始化书本，总页数:', allPages.length);
    
    // 显示第一页
    currentPageIndex = 0;
    showCurrentPage();
    
    // 绑定按钮事件
    const homeBtn = document.getElementById('homeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 返回主页按钮
    if (homeBtn) {
        homeBtn.onclick = (e) => {
            console.log('🏠 返回主页按钮被点击');
            goHome();
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            console.log('🔴 上一页按钮被点击了！');
            prevPage();
        };
        // 额外添加addEventListener作为备用
        prevBtn.addEventListener('click', (e) => {
            console.log('🔵 上一页addEventListener触发');
        });
    } else {
        console.error('❌ 找不到上一页按钮！');
    }
    
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            console.log('🔴 下一页按钮被点击了！');
            nextPage();
        };
        // 额外添加addEventListener作为备用
        nextBtn.addEventListener('click', (e) => {
            console.log('🔵 下一页addEventListener触发');
        });
    } else {
        console.error('❌ 找不到下一页按钮！');
    }
    
    console.log('✅ 书本初始化完成');
    console.log('✅ 返回主页按钮:', homeBtn);
    console.log('✅ 上一页按钮:', prevBtn);
    console.log('✅ 下一页按钮:', nextBtn);
}

// 显示当前页面
function showCurrentPage() {
    const bookContainer = document.getElementById('bookContainer');
    bookContainer.innerHTML = '';
    
    console.log('显示页面:', currentPageIndex);
    
    // 创建左页（当前页）
    const leftPage = document.createElement('div');
    leftPage.className = 'page-left';
    leftPage.innerHTML = allPages[currentPageIndex];
    bookContainer.appendChild(leftPage);
    
    // 创建右页（下一页，如果存在）
    if (currentPageIndex + 1 < allPages.length) {
        const rightPage = document.createElement('div');
        rightPage.className = 'page-flip-container right';
        
        const frontPage = document.createElement('div');
        frontPage.className = 'page page-front';
        frontPage.innerHTML = allPages[currentPageIndex + 1];
        
        rightPage.appendChild(frontPage);
        
        // 如果还有下下一页，添加背面
        if (currentPageIndex + 2 < allPages.length) {
            const backPage = document.createElement('div');
            backPage.className = 'page page-back';
            backPage.innerHTML = allPages[currentPageIndex + 2];
            rightPage.appendChild(backPage);
        }
        
        bookContainer.appendChild(rightPage);
    }
    
    // iOS滚动修复：为所有text-content元素启用滚动
    setTimeout(() => {
        enableScrollForAllPages();
    }, 50);
    
    updateButtons();
}

// 启用所有页面的滚动功能（特别针对iOS）
function enableScrollForAllPages() {
    // 如果是iOS设备，对容器做特殊处理
    if (isIOS) {
        const flipContainers = document.querySelectorAll('.page-flip-container');
        flipContainers.forEach(container => {
            container.style.transformStyle = 'flat';
            container.style.webkitTransformStyle = 'flat';
            container.style.webkitOverflowScrolling = 'touch';
            container.style.touchAction = 'pan-y';
        });
        
        const pages = document.querySelectorAll('.page, .page-left');
        pages.forEach(page => {
            page.style.webkitOverflowScrolling = 'touch';
            page.style.touchAction = 'pan-y';
            page.style.pointerEvents = 'auto';
        });
        
        console.log('📱 iOS设备：已优化', flipContainers.length, '个翻页容器');
    }
    
    const textContents = document.querySelectorAll('.text-content');
    textContents.forEach(content => {
        // 强制设置滚动相关样式
        content.style.webkitOverflowScrolling = 'touch';
        content.style.touchAction = 'pan-y';
        content.style.overflowY = 'auto';
        content.style.minHeight = '0';
        content.style.position = 'relative';
        
        // 为iOS添加触摸事件监听，防止被父容器阻止
        let startY = 0;
        let isScrolling = false;
        
        content.addEventListener('touchstart', function(e) {
            startY = e.touches[0].pageY;
            isScrolling = content.scrollHeight > content.clientHeight;
        }, { passive: true });
        
        content.addEventListener('touchmove', function(e) {
            if (!isScrolling) return;
            
            const currentY = e.touches[0].pageY;
            const scrollTop = content.scrollTop;
            const scrollHeight = content.scrollHeight;
            const clientHeight = content.clientHeight;
            
            // 允许内部滚动
            const isAtTop = scrollTop === 0 && currentY > startY;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight && currentY < startY;
            
            // 只在滚动到边界时才阻止默认行为
            if (!isAtTop && !isAtBottom) {
                e.stopPropagation();
            }
        }, { passive: true });
    });
    
    console.log('✅ 已为', textContents.length, '个内容区域启用iOS滚动');
}

// 更新按钮状态
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) {
        console.error('❌ 找不到按钮元素！');
        return;
    }
    
    const shouldDisablePrev = currentPageIndex === 0;
    const shouldDisableNext = currentPageIndex >= allPages.length - 2;
    
    prevBtn.disabled = shouldDisablePrev;
    nextBtn.disabled = shouldDisableNext;
    
    console.log('🔄 更新按钮状态:');
    console.log('  当前页:', currentPageIndex);
    console.log('  总页数:', allPages.length);
    console.log('  上一页禁用:', shouldDisablePrev, '(currentPageIndex === 0)');
    console.log('  下一页禁用:', shouldDisableNext, '(currentPageIndex >= ' + (allPages.length - 2) + ')');
    console.log('  计算:', currentPageIndex, '>=', allPages.length - 2, '=', shouldDisableNext);
}

// 下一页
function nextPage() {
    console.log('📖📖📖 nextPage函数被调用了！！！');
    console.log('当前状态: currentPageIndex =', currentPageIndex, ', isAnimating =', isAnimating, ', totalPages =', allPages.length);
    
    if (isAnimating) {
        console.log('❌ 正在翻页中，忽略点击');
        return;
    }
    
    if (currentPageIndex >= allPages.length - 2) {
        console.log('❌ 已经是最后一页，无法继续');
        return;
    }
    
    console.log('✅ 开始翻到下一页！');
    isAnimating = true;
    
    const flipContainer = document.querySelector('.page-flip-container');
    if (flipContainer) {
        flipContainer.classList.add('flipping');
        flipContainer.classList.add('flipped');
        
        setTimeout(() => {
            currentPageIndex += 2;
            isAnimating = false;
            showCurrentPage();
        }, 1000);
    } else {
        isAnimating = false;
    }
}

// 上一页
function prevPage() {
    if (isAnimating) {
        console.log('正在翻页中...');
        return;
    }
    
    if (currentPageIndex === 0) {
        console.log('已经是第一页');
        return;
    }
    
    console.log('翻到上一页');
    isAnimating = true;
    
    currentPageIndex -= 2;
    
    setTimeout(() => {
        isAnimating = false;
        showCurrentPage();
    }, 100);
}

// 返回主页
function goHome() {
    console.log('🏠 返回主页');
    
    // 隐藏书本容器和导航按钮
    const bookContainer = document.getElementById('bookContainer');
    const navContainer = document.getElementById('navContainer');
    const coverPage = document.getElementById('coverPage');
    
    bookContainer.style.display = 'none';
    navContainer.style.display = 'none';
    coverPage.style.display = 'flex';
    coverPage.classList.remove('opening');
    
    // 重置状态，允许再次打开
    isInitialized = false;
    currentPageIndex = 0;
    isAnimating = false;
    
    console.log('✅ 已返回主页，可以重新打开');
}
