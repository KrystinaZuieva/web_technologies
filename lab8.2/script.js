class Carousel{
    constructor(container,{slides=[],duration=500,autoplay=false,autoplayInterval=3000,showArrows=true,showDots=true}={}){
        this.container=container;
        this.slidesData=slides;
        this.duration=duration;
        this.autoplay=autoplay;
        this.autoplayInterval=autoplayInterval;
        this.showArrows=showArrows;
        this.showDots=showDots;
        this.current=0;
        this.isAnimating=false;
        this.timer=null;
        this.init();
    }
    init(){
        this.container.style.setProperty('--duration',this.duration+'ms');
        this.track=document.createElement('div');
        this.track.className='slider-track';
        this.container.appendChild(this.track);
        this.buildSlides();
        if(this.showArrows)this.buildArrows();
        if(this.showDots)this.buildDots();
        this.container.addEventListener('keydown',this.onKeyDown.bind(this));
        this.container.addEventListener('mouseenter',()=>this.pause());
        this.container.addEventListener('mouseleave',()=>this.play());
        this.track.addEventListener('transitionend',()=>this.onTransitionEnd());
        if(this.autoplay)this.play();
    }
    buildSlides(){
        this.slides=[];
        this.track.innerHTML='';
        const all=[this.slidesData[this.slidesData.length-1],...this.slidesData,this.slidesData[0]];
        all.forEach(c=>{
            const s=document.createElement('div');s.className='slide';
            if(c instanceof HTMLElement)s.appendChild(c.cloneNode(true));else s.innerHTML=c;
            this.track.appendChild(s);this.slides.push(s);
        });
        this.track.style.transform='translateX(-100%)';
    }
    buildArrows(){
        this.prevBtn=document.createElement('button');
        this.prevBtn.className='slider-arrow left';this.prevBtn.innerHTML='\u2039';
        this.container.appendChild(this.prevBtn);
        this.prevBtn.addEventListener('click',()=>this.move(-1));
        this.nextBtn=document.createElement('button');
        this.nextBtn.className='slider-arrow right';this.nextBtn.innerHTML='\u203A';
        this.container.appendChild(this.nextBtn);
        this.nextBtn.addEventListener('click',()=>this.move(1));
    }
    buildDots(){
        this.dotsWrapper=document.createElement('div');
        this.dotsWrapper.className='slider-dots';
        this.dots=[];
        this.slidesData.forEach((_,i)=>{
            const b=document.createElement('button');if(i===0)b.classList.add('active');
            b.addEventListener('click',()=>this.goTo(i));
            this.dotsWrapper.appendChild(b);this.dots.push(b);
        });
        this.container.appendChild(this.dotsWrapper);
    }
    onKeyDown(e){if(e.key==='ArrowLeft')this.move(-1);if(e.key==='ArrowRight')this.move(1);}
    move(d){if(this.isAnimating)return;this.isAnimating=true;this.current+=d;this.updateDots();
        this.track.style.transition=`transform ${this.duration}ms ease`;
        this.track.style.transform=`translateX(${-(this.current+1)*100}%)`;
    }
    goTo(i){if(this.isAnimating)return;this.isAnimating=true;this.current=i;this.updateDots();
        this.track.style.transition=`transform ${this.duration}ms ease`;
        this.track.style.transform=`translateX(${-(this.current+1)*100}%)`;
    }
    onTransitionEnd(){this.isAnimating=false;
        if(this.current<0){this.current=this.slidesData.length-1;this.jump();}
        else if(this.current>=this.slidesData.length){this.current=0;this.jump();}
    }
    jump(){this.track.style.transition='none';
        this.track.style.transform=`translateX(${-(this.current+1)*100}%)`;void this.track.offsetWidth;}
    updateDots(){if(!this.dots)return;this.dots.forEach((d,i)=>d.classList.toggle('active',i===((this.current+this.slidesData.length)%this.slidesData.length)));}
    play(){if(!this.autoplay)return;this.timer=setInterval(()=>this.move(1),this.autoplayInterval);}
    pause(){clearInterval(this.timer);}
}

// Ініціалізація після завантаження DOM
window.addEventListener('DOMContentLoaded',()=>{
    const slides=[
        '<img src="https://picsum.photos/seed/1/800/400" alt="Slide 1">',
        '<img src="https://picsum.photos/seed/2/800/400" alt="Slide 2">',
        '<img src="https://picsum.photos/seed/3/800/400" alt="Slide 3">',
        '<div style="display:flex;justify-content:center;align-items:center;height:100%;font-size:2rem;background:#333;color:#fff">Текстовий слайд</div>',
        '<video src="https://www.w3schools.com/html/mov_bbb.mp4" muted loop></video>'
    ];
    new Carousel(document.getElementById('carousel'),{
        slides,
        duration:600,
        autoplay:true,
        autoplayInterval:4000,
        showArrows:true,
        showDots:true
    });
});