/**
 * 1. render songs
 * 2. scroll top
 * 3. play/pause/seek
 * 4. cd rotate
 * 5. next/previous
 * 6. random
 * 7. next/repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')

const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-play-toggle')
const process = $('#process')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-previous')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const favouriteBtn = $('.favourite-btn')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Light switch',
            singer: 'Charie Puth',
            path: './musics/Charlie-Puth-Light-Switch.mp3',
            image: './images/LightSwitch.jpg'
        },
        {
            name: 'Mang tien ve cho me',
            singer: 'Den Vau ft. Nguyen Thao',
            path: './musics/Mang Tien Ve Cho Me - Den_ Nguyen Thao.mp3',
            image: './images/MangTienVeChoMe.jpg'
        },
        {
            name: 'Dangerously',
            singer: 'Charie Puth',
            path: './musics/TaiNhacTre.Net - Dangerously.mp3',
            image: './images/Dangerously.jpg'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './musics/Unstoppable-Sia-4312901.mp3',
            image: './images/Unstoppable.jpeg'
        },
        {
            name: 'Di ve nha',
            singer: 'Den Vau ft. JustaTee',
            path: './musics/Di Ve Nha - Den_ JustaTee.mp3',
            image: './images/DiVeNha.jpg'
        },
        {
            name: 'Reality',
            singer: 'Charie Puth',
            path: './musics/Reality - Lost Frequencies_ Janieck Devy.mp3',
            image: './images/Reality.jpg'
        },
        {
            name: 'Mang chung (Rap version)',
            singer: 'Zhao Fangjing',
            path: './musics/MangChungRapVersion-AmKhuyetThiThinhTrieuPhuongTinhNoisemaker-6135781.mp3',
            image: './images/MangChung.jpg'
        },
        {
            name: 'Chi la khong cung nhau',
            singer: 'Tang Phuc ft. Truong Thao',
            path: './musics/ChiLaKhongCungNhauLive-TangPhucTruongThaoNhi-6994969.mp3',
            image: './images/ChiLaKhongCungNhau.jpg'
        },
        {
            name: 'Trip',
            singer: 'Ella Mai ',
            path: './musics/Trip-EllaMai-5734839.mp3',
            image: './images/Trip.jpg'
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url(${song.image});">
                </div>
                <div class="body">
                    <h3 class="title">
                        ${song.name}
                    </h3>
                    <p class="author">
                        ${song.singer}
                    </p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    <div class="option-collapse">
                        <div class="option-item">
                            <i class="fas fa-stream"></i>
                            Add to favorite list
                        </div>
                        <div class="option-item">
                            <i class="fas fa-download"></i>
                            Download .mp3
                        </div>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')

    },
    defineProperties : function(){
        Object.defineProperty(this, 'currentSong', {
            get : function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents : function(){
        const cdWidth = cd.offsetWidth

        // Xử lý phần phóng to + thu nhỏ CD khi scroll 
        document.onscroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollY
            cd.style.width = newCDWidth > 20 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth
        }

        // Xử lý CD quay / dừng 
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 20000, //20s -> tốc độ quay của CD
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý khi click play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        
        // Khi song được play 
        audio.onplay = function (){
            app.isPlaying = true
            $('.btn-play-toggle').classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song được pause
        audio.onpause = function (){
            app.isPlaying = false
            $('.btn-play-toggle').classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const processPercent = Math.floor(audio.currentTime / audio.duration * 100)
                process.value = processPercent
            }
        }

        // Xử lý khi tua bài hát   
        process.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý Khi next song + prev song
        nextBtn.onclick = function() {
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.nextSong()
            }
            audio.play()
        }
        prevBtn.onclick = function() {
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.prevSong()
            }
            audio.play()
        }
        
        // Xử lý khi bật/tắt random song
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active')
        }
        
        // Xử lý khi muốn lặp lại bài hát 
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active')
        }

        // Xử lý tự next song khi hết bài hát
        audio.onended = function() {
            if(app.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
            
            // Xử lý khi click vào songNode
            if(songNode && !optionNode){
                    app.currentIndex = songNode.dataset.index
                    app.loadCurrentSong()
                    audio.play()
               $('.option-collapse.active').classList.remove('active')

            }
            // Xử lý khi click vào optionNode
            if(optionNode){
                const optionCollapse = optionNode.querySelector('.option-collapse') 
                optionCollapse.classList.toggle('active')
           }
        }
        
        // Xử lý nút favourite
        favouriteBtn.onclick = function() {
            favouriteBtn.classList.toggle("active")
        }
    },
    loadCurrentSong : function(){
        header.innerText =  this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        
        // Active song
        const playListSongs = $$('.song')
        $('.song.active').classList.remove("active")
        playListSongs[this.currentIndex].classList.add("active")
    },
    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()

        // Xử lý kéo view theo bài hát đang phát
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'end'
            })
        }, 300)
    },
    prevSong : function(){
        if(this.currentIndex == 0){
            this.currentIndex = this.songs.length - 1
        }
        else {
            this.currentIndex--
        }
        this.loadCurrentSong()

        // Xử lý kéo view theo bài hát đang phát
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'end'
            })
        }, 300)
    },
    playRandomSong : function(){
        let oldIndex = this.currentIndex
        do{
            this.currentIndex = Math.floor(Math.random() * this.songs.length) 
        }while(this.currentIndex == oldIndex)
        this.loadCurrentSong()
    },
    start: function(){
        //Render lại playlist
        this.render()

        //Định nghĩa các thuộc tính cho object
        this.defineProperties()
        
        //Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi mới chạy ứng dụng
        this.loadCurrentSong()
    }
}


app.start()