cc.Class({
    extends: cc.Component,

    properties: {
        m_HeroAnim:cc.Animation,
        m_Collider:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.touchingNumber = 0;
        this.m_Collider = this.m_Collider.getComponent('HeroCollision');
        
        this.m_BtRoll = g_BaseView.m_BtRoll;
        this.m_BtJump = g_BaseView.m_BtJump;
        this.play('Run');
        this.m_BtRoll.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.m_BtRoll.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.m_BtRoll.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
        
        this.m_BtJump.node.on(cc.Node.EventType.TOUCH_START,this.touchJumpStar,this);
    

    },
    play:function(playName)
    {
        if( playName == 'Run' && g_UserInfoData.m_CurHAS_State == HAS_Run )
        {
            return;
        }
        if( playName == 'Run')
        {
            g_UserInfoData.m_CurHAS_State = HAS_Run;
        }
        else  if( playName == 'Jump')
        {
            g_UserInfoData.m_CurHAS_State = HAS_Jump1;
        }
        else  if( playName == 'Roll')
        {
            g_UserInfoData.m_CurHAS_State = HAS_Roll;
        }
        var name = playName + g_UserInfoData.m_CurSelHeroID;
        this.m_HeroAnim.play(name);
    },
    getCurrentClipName:function()
    {
        return this.m_HeroAnim.currentClip.name;
    },
    touchJumpStar:function()
    {
        this.onAnimationChange(this,'Jump');
    },
    touchStart:function()
    {
        cc.log('touchStart');
        if(g_UserInfoData.m_CurHAS_State == HAS_Jump1||
            g_UserInfoData.m_CurHAS_State == HAS_Jump2 )
        {
            return;
        }
        this.play('Roll');
    },
    touchEnd:function()
    {
        cc.log('touchEnd');
        if(g_UserInfoData.m_CurHAS_State == HAS_Jump1||
            g_UserInfoData.m_CurHAS_State == HAS_Jump2 )
        {
            return;
        }
        this.play('Run');
    },
    callBackDownOver:function()
    {
        cc.log('callBackDownOver');
        // var anim = this.getComponent(cc.Animation);
        this.play('Run');
    },
    onAnimationChange:function(target,data)
    {
        cc.log("onAnimationChange "+data);

        if( data == 'Jump' && this.isCanChangeClip('Jump') )
        {
            // var moveUp = cc.moveTo(1,-92,42).easing(cc.easeCubicActionOut());
            // var moveDown = cc.moveTo(1,-92,-52).easing(cc.easeCubicActionIn());
            // var callBack = cc.callFunc(this.callBackDownOver,this,this);
            // var seq = cc.sequence(moveUp,moveDown,callBack); 
            // this.m_HeroAnim.node.runAction(seq);
            this.m_Collider.m_Dir.y = HeroDir_Up;
            this.m_Collider.m_HeroJumpHeight = 0;

        }

        this.play(data);
    },

    isCanChangeClip:function(playName)
    {
        //判断滑铲
        if( playName == 'Roll')
        {
            //如果是跳跃动画,返回否
            if( g_UserInfoData.m_CurHAS_State == HAS_Jump1 )
            {
                return false;
            }
            //如果是跑动,返回可以
            else if( g_UserInfoData.m_CurHAS_State == HAS_Run)
            {
                return true;
            }
        }
        //判断可不可以播放跳跃
        else if( playName == 'Jump')
        {
            //如果是跑动,可以
            if( g_UserInfoData.m_CurHAS_State == HAS_Run)
            {
                return true;
            }
            //其他任何动画播放时,都不可以
            else 
            {
                return false;
            }
        }
        //其他动作都可以
        return true;
    },
    // myHeroPlay:function(playName)
    // {
    //     if( this.isCanChangeClip(playName) == false)
    //     {
    //         return;
    //     }
    //     if( playName == 'Roll' )
    //     {
    //         this.m_Hero.node.setPosition(-92,-57);
    //     }
    //     else if( playName == 'Run')
    //     {
    //         this.m_Hero.node.setPosition(-92,-49);

    //     }
    //     this.m_Hero.play(playName);
    // },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
