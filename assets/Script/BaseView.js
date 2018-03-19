cc.Class({
    extends: cc.Component,

    properties: {
        m_BtRoll:cc.Button,
        m_BtJump:cc.Button,
        m_Back1:[cc.Node],
        m_Back2:[cc.Node],
        
        m_Back3:[cc.Node],
        m_Back4:[cc.Node],
        m_Back5:[cc.Node],
        m_Floor:[cc.Node],
        m_HeroPrefab:[cc.Prefab],
        m_GameOver:cc.Node,
    },

    // use this for initialization
    //第一次进入,空间创建产生后会调用的函数
    onLoad: function () {
        this.m_GameOver.active = false;
        g_BaseView = this;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        // cc.log('Hello World');
        // this.m_Hero = this.m_Hero.getComponent(cc.Animation);
        this.m_Hero = cc.instantiate(this.m_HeroPrefab[g_UserInfoData.m_CurSelHeroID] );
        this.node.addChild(this.m_Hero);
        this.m_Hero = this.m_Hero.getComponent('SceneHeroMng');

        

        var tmpBack=[this.m_Back1,this.m_Back2,this.m_Back3,this.m_Back4,this.m_Back5];
        var times=[BackMoveTime1,BackMoveTime2,BackMoveTime3,BackMoveTime4,BackMoveTime5];
        for (var j = 0; j < tmpBack.length; j++) {
            for (var i = 0; i < this.m_Back1.length; i++) {

                var width = tmpBack[j][i].width;
                tmpBack[j][i].setPosition(i*(width-3),0);
                
                var move1 = cc.moveTo(i*times[j]+times[j],cc.p(-(width-3),0));
                var seq1 = cc.sequence(move1,cc.callFunc(this.backMoveEnd,this,times[j]));
                tmpBack[j][i].runAction(seq1);
            }
            
        }
        for (var i = 0; i < this.m_Floor.length; i++) {
            var floor = this.m_Floor[i].getComponent('Floor');
            floor.setBaseView(this);
            floor.changeFloor();
        }

    },
    backMoveEnd:function(target,data)
    {
        var width = target.width;
        target.setPosition(width-4,0);

        var move = cc.moveTo(data*2,cc.p(-(width-4),0));
        var seq = cc.sequence(move,cc.callFunc(this.backMoveEnd,this,data));
        target.runAction(seq);
    },

    GameOver:function()
    {
        var tmpBack=[this.m_Back1,this.m_Back2,this.m_Back3,this.m_Back4,this.m_Back5];
        var times=[BackMoveTime1,BackMoveTime2,BackMoveTime3,BackMoveTime4,BackMoveTime5];
        for (var j = 0; j < tmpBack.length; j++) {
            for (var i = 0; i < this.m_Back1.length; i++) {
                tmpBack[j][i].stopAllActions();
            }
            
        }
        
        for (var i = 0; i < this.m_Floor.length; i++) {
            this.m_Floor[i].stopAllActions();
        }
        
        this.m_GameOver.active = true;
    },
    onChangeSceneToMainView:function()
    {
        cc.log('onChangeSceneToMainView');
        cc.director.loadScene("RoomScene");
    },
    onRePlayGame:function()
    {
        cc.log('onRePlayGame');

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
