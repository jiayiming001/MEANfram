var pics = [
    [
        "http://p1.music.126.net/Gg_QIW4-psnYWvh7MticxA==/109951163337403023.jpg",
        "http://p1.music.126.net/2M57jL8iFFSPAbA6uiP4GQ==/109951163337395366.jpg"
        
    ],
    [
        "http://p1.music.126.net/SGAo1TYD-TlQNfKa8GmBvQ==/109951163335143882.jpg",
        "http://p1.music.126.net/zRNAeeFjRG4-NjMOflH4OQ==/109951163335140917.jpg"
    ],
    [
        "http://p1.music.126.net/JxgNvkbkFE-pwpIjtUkgew==/109951163337696047.jpg",
        "http://p1.music.126.net/FahjlDU7IIXR2pAVnWLxiA==/109951163337691785.jpg"
    ],
    [
        "http://p1.music.126.net/mhZPk_h0HKb4xcg-RYJp8Q==/109951163337696517.jpg",
        "http://p1.music.126.net/wL2rXAsI4LJ4DSMdG4R34g==/109951163337388515.jpg"
    ]
];
$(document).ready(function () {
    var picId = 0;
    var bgi = "background-image: url(\"";
    var bgr = "background-repeat: repeat-x";

    $(".m-tophead").mouseenter(function () {
        $(".m-tophead .m-tlist").attr("style", "");
    }).
    mouseleave(function () {
        $(".m-tophead .m-tlist").attr("style", "display:none;");
    });

    $(".g-iframe .n-ban").attr("style", bgi + pics[picId][0] + "\");" + bgr + ";");
    $(".g-iframe .wrap a img").attr("src", pics[picId][1] + ";");

    var subPic = function () {
        picId --;
        if(picId <= -1) {picId = pics.length-1;}
        $(".g-iframe .n-ban").attr("style", bgi + pics[picId][0] + "\");" + bgr + ";");
        $(".g-iframe .wrap a img").attr("src", pics[picId][1] + ";");
    };

    var addPic = function () {
        picId ++;
        if(picId >= pics.length) {picId=0;}
        $(".g-iframe .n-ban").attr("style", bgi + pics[picId][0] + "\");" + bgr + ";");
        $(".g-iframe .wrap a img").attr("src", pics[picId][1] + ";");
    };

    $(".g-iframe .ban .btnl").click(subPic);
    $(".g-iframe .ban .btnr").click(addPic);


    var t = setInterval(addPic, 3000);
    $(".g-iframe .n-ban").mouseover(()=>{
        if(t){
            clearInterval(t);
            t = null;
        }     
    });

    $(".g-iframe .n-ban").mouseleave(()=>{
        if(t) {
            clearInterval(t);
            t = null;
        }
        t = setInterval(addPic, 3000);
    });

    $(".m-tlist .local").click(function () {
        let innerhtml = 
            `<div class="m-layer" style="top: 35px; left: 308px">
                <div class="zbar">
                    <div class="zttl f-thide">本地登录</div>
                </div>
                <div class="zcnt">
                    <form action="/signin" method="POST">
                        <div>
                            <label>Username:</label>
                            <input type="text" name="username"/>
                        </div> 
                        <div>
                            <label>Password:</label>
                            <input type="text" name="password" />
                        </div>
                        <div>
                            <input type="submit" value="Sign In"/>
                        </div>
                    </form>
                </div>
            </div>`
        $('body').append(innerhtml);
    })
});