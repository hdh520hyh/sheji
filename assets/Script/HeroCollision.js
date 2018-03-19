cc.Class({
    extends: cc.Component,

    properties: {
        m_HeroAnim:cc.Animation,
        m_MoveNode:cc.Node,
    },

    ctor:function()
    {
        this.CTF_Count = 0;
        this.m_Dir = {x:HeroDir_None,y:HeroDir_Down};
        this.m_CollisionFlag = new Array();
        for (var i = 0; i < 20; i++) {
            this.m_CollisionFlag[i] = 0;
        }
        this.m_PushCollision = null;
        this.m_HeroJumpHeight = 0;
    },
    // use this for initialization
    onLoad: function () {
        this.m_MoveNode.setPosition(-92,-57);
        this.m_ShoveCollider = null;
        this.m_SceneHeroMng = this.m_MoveNode.getComponent('SceneHeroMng');
    },

    //碰撞开启
    onCollisionEnter: function (other,self) {
        this.m_HeroAnim.node.color = cc.Color.RED;
        this.m_CollisionFlag[other.tag]++;

        if( other.tag == CollisionType_Floor)
        {
            this.m_Dir.y = HeroDir_None;
            other.world.aabb.yMax;
            var pos = this.m_MoveNode.parent.convertToNodeSpaceAR(cc.p(0,other.world.aabb.yMax));
            this.m_MoveNode.setPositionY(pos.y+this.m_MoveNode.height/2);
            this.m_SceneHeroMng.play('Run');
        }
        if( other.tag == CollisionType_Shove )
        {
        }
        if( other.tag == CollisionType_Death )
        {
            g_BaseView.GameOver();
        }

    },
    //碰撞进行
    onCollisionStay: function (other,self) {
        // console.log('on collision stay');
        if( other.tag == CollisionType_Shove )
        { 
            var tmpX = other.node.getNodeToWorldTransformAR().tx;
            tmpX -= other.size.width/2;
            tmpX -= this.node.width/2;
            var pos = this.m_MoveNode.parent.convertToNodeSpaceAR(cc.p(tmpX,0));
            this.m_MoveNode.setPositionX(pos.x);
        }

    },
    //碰撞结束
    onCollisionExit: function (other) {
        this.m_CollisionFlag[other.tag]--;
        if (this.m_CollisionFlag[CollisionType_Floor] == 0) {
            this.m_HeroAnim.node.color = cc.Color.WHITE;
            if( this.m_Dir.y != HeroDir_Up)
                this.m_Dir.y = HeroDir_Down;
        }
        if (this.m_CollisionFlag[CollisionType_Shove] == 0) {
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //cc.log(dt);
        //s=v*t;
        var s = 100*dt;
        if( this.m_Dir.y == HeroDir_Up)
        {
            this.m_HeroJumpHeight += s;
            if( this.m_HeroJumpHeight > 50 )
            {
                this.m_Dir.y = HeroDir_Down;
            }
        }
        this.m_MoveNode.y += s*this.m_Dir.y;
    },
});
