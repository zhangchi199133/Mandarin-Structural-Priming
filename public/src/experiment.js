
// CONSTANTS
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD;

// detect visitor variables with the bowser js library (/js/bowser.js)

jsPsych.data.addProperties({ // add these variables to all rows of the datafile
  browser_name: bowser.name, browser_version: bowser.version,
  os_name: bowser.osname, os_version: bowser.osversion,
  tablet: String(bowser.tablet), mobile: String(bowser.mobile),
 // convert explicitly to string so that "undefined" (no response) does not lead to empty cells in the datafile
  screen_resolution: screen.width + ' x ' + screen.height,
  window_resolution: window.innerWidth + ' x ' + window.innerHeight, // this will be updated throughout the experiment
});

    var Part_ID = jsPsych.randomization.randomID()

    jsPsych.data.addProperties({
    part_ID: Part_ID,
    ID_DATE: Part_ID + "_" + DATE,
            })
    /* create timeline */
    var timeline = [];


      /* Instruction*/
      /* Welcomepage and fullscreen*/

      var fullscr = {
        type: 'fullscreen',
        fullscreen_mode: true,
        message: full_screen_message,
        button_label: "进入实验",
        on_start: function(trial){
          if (bowser.name == 'Firefox' || bowser.name == 'Chrome'){
            trial.pages = welcome_page;
          } else {
            trial.pages = not_supported_page;
            setTimeout(function(){location.href="not_supported.html"}, 2000);
          }
      }
    }
          timeline.push(fullscr);

          /* Audio input test*/
                var audiotestinstruction = {
                  type: "html-button-response",
                  stimulus: '<div style="font-size:24px;"><p>首先我们先测试一下您是否可以听到实验中的音频材料</p>'+
                  '<p>您将听到一个三国人物，请点击您听到的名字</p>',
                  choices: ["进入音频测试"],
                };
                    timeline.push(audiotestinstruction);

                var audiotest = {
                  type:"audio-button-response",
                  stimulus:'../aud/weiyan.mp3',
                  prompt:'<div style="font-size:24px;"><p>请点击您听到的三国人物</p>',
                  choices:["诸葛亮","刘备","张飞","许诸","赵云","曹操","魏延","关羽"],
                  data: {test_part: 'audiotest', correct_response:6},
                  on_finish: function(data) {
                      if (data.button_pressed == data.correct_response) { // key press == correct response
                          data.accuracy = 1
                      } else { // key press != correct response
                          data.accuracy = 0
                      }
                  }
                }
                timeline.push(audiotest);

                var audiotestinstructionrep1 = {
                  type: "html-button-response",
                  stimulus: '<div style="font-size:24px;"><p>回答错误，请您确认音频输入设备是否已经正确连接。并再次进行测试</p>',
                  choices: ["再次进入音频测试"],
                };

                var audiotestrep1 = {
                  type:"audio-button-response",
                  stimulus:'../aud/weiyan.mp3',
                  prompt:'<div style="font-size:24px;"><p>请点击您听到的三国人物</p>',
                  choices:["诸葛亮","刘备","张飞","许诸","赵云","曹操","魏延","关羽"],
                  data: {test_part: 'instruction2', correct_response:6},
                  on_finish: function(data) {
                      if (data.button_pressed == data.correct_response) { // key press == correct response
                          data.accuracy = 1
                      } else { // key press != correct response
                          data.accuracy = 0
                      }
                  }
                }

                var if_node1 = {
                    timeline: [audiotestinstructionrep1, audiotestrep1],
                    conditional_function: function(){
                        // get the data from the previous trial,
                        // and check the accuracy
                          var last_trial_accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
                          if (last_trial_accuracy == 1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                timeline.push(if_node1);

                var if_node2 = {
                    timeline: [audiotestinstructionrep1, audiotestrep1],
                    conditional_function: function(){
                        // get the data from the previous trial,
                        // and check the accuracy
                          var last_trial_accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
                          if (last_trial_accuracy == 1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                timeline.push(if_node2);

                var sorry = {
                        type: "html-keyboard-response",
                        stimulus: '<div style="font-size:24px;">非常抱歉，因无法确认您的设备是否正确连接，即将退出实验。相关问题请联系实验员chi.zhang@ugent.be',
                        choices: jsPsych.NO_KEYS,
                        on_start: function(trial){
                            trial.pages = not_supported_page;
                            setTimeout(function(){location.href="not_supported.html"}, 2000);
                        }
                      };

                var if_node3 = {
                    timeline: [sorry],
                    conditional_function: function(){
                        // get the data from the previous trial,
                        // and check the accuracy
                          var last_trial_accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
                          if (last_trial_accuracy == 1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                timeline.push(if_node3);

                // voice input test
                var voicetestinstruction = {
                  type: "html-button-response",
                  stimulus: '<div style="font-size:24px;"><p>回答正确！</p>'+
                  '<p>下面请您测试您的语音输入设备</p>'+
                  '<p>在下一页面中，请您复述屏幕上的词语</p>'+
                  '<p>当红点出现时表示正在录音。6秒后红点消失，录音结束</p>'+
                  '<p>录音完成后，请点击播放键检查是否有录音记录</p>'+
                  '<p>如无声音，请点击"重录"重新录音</p>'+
                  '<p>如果录音成功，请点击“确定”进入下一个练习</p>',
                  choices: ["进入语音输入测试"],
                };
                    timeline.push(voicetestinstruction);

                  var voicetest =  {
                    type: "image-audio-response",
                    stimulus: '../img/blank.png',
                    prompt:
                    function(){
                              var html="<img src =' ../img/smile.png' style='height:75px'></img>";
                              return html;
                          },
                    allow_playback: true,
                    wait_for_mic_approval: true,
                    buffer_length:6000,
                    response_ends_trial:false,
                    data:{test_part: 'voicetest'}
                    }

                  timeline.push(voicetest);

// Informed consent
      var welcome = {
        type: "html-button-response",
        stimulus: welcome_page,
        choices: ["我已阅读并同意知情同意书"]
      };
          timeline.push(welcome);

// Get participants' age and place of born
    var demographicInfo = {
      type: 'survey-text',
      questions: [
        {prompt: '<div style="font-size:24px;"><p>基本信息</p<br><p>请填写您的年龄</p>',
        required : true,
        name : 'age'},
        {prompt: '<div style="font-size:24px;"><p>您的出生地</p>',
        required : true,
        placeholder: "市, 省/自治区, 国家",
        name : 'birthplace'},
        {prompt: '<div style="font-size:24px;"><p>您常用的方言</p>',
        required : true,
        placeholder: "如无常用方言请填“无”",
        name : 'dialect'}
                ],
      data:{test_part: 'demographicInfo'},
      button_label: "下一页"
    }
      timeline.push(demographicInfo);


  // get participant's gender and add it to the datafile
  var gender = {
    type: 'survey-multi-choice',questions: [{
      prompt: '<div style="font-size:24px;">请选择您的性别',
      options: ['女性','男性', '其它', '不便透露'],
      required: true
    }, ],
    button_label: "下一页"
};
      timeline.push(gender);

      // Get participants' langauge background
          var languagebackground1 = {
            type: 'survey-text',
            questions: [
              {prompt: '<div style="font-size:24px;"><p>请填写<br>您最常用的第二语言</p>',
              required : true,
              name : 'L2name'},
              {prompt: '<div style="font-size:24px;"><p>从您开始学习该第二语言开始距今多久</p>',
              required : true, placeholder: "以年为单位",
              name : 'L2years'},
              {prompt: '<div style="font-size:24px;"><p>您每天使用该第二语言的平均时长</p>',
              required : true, placeholder: "以小时为单位",
              name : 'L2hours'},
                      ],
            data:{test_part: 'demographicInfo'},
            button_label: "下一页"
          }
            timeline.push(languagebackground1);

            var languagebackground2 = {
              type: 'survey-multi-choice',questions: [{
                prompt: '<div style="font-size:24px;">您是否在以您第二语言为母语的地区生活/工作过三个月以上',
                options: ['是','否'],
                required: true,
                horizontal: true,
                name : 'L2experience'
              }, {
                prompt: '<p style="font-size:24px;">请为您的第二语言流利程度打分（1为不流利，7为非常流利)',
                options: ['1', '2','3', '4', '5', '6', '7'],
                required: true,
                horizontal: true,
                name: 'L2rating'
              },],
              button_label: "进入实验说明"
          };
                timeline.push(languagebackground2);


      /* Instruction1*/
    var instruction1 = {
      type: 'instructions',
      pages: page1,
      show_clickable_nav: true,
      button_label_previous: "上一页",
      button_label_next: "下一页",
      data:{test_part: 'instruction1'}
    }

      timeline.push(instruction1);

      var instruction2 = {
        type:"audio-button-response",
        stimulus:'../aud/小宝宝叫了.mp3',
        prompt:
        function(){
                  var html = '<div style="font-size:24px;"><p>请您点击按钮判断图片与描述是否匹配</p>'
                  html+="<img src='../img/练启动 叫 小宝宝.png'></img>";
                  return html;
              },
        choices:["是","否"],
        data: {test_part: 'instruction2', correct_response:0},
        on_finish: function(data) {
            if (data.button_pressed == data.correct_response) { // key press == correct response
                data.accuracy = 1
            } else { // key press != correct response
                data.accuracy = 0
            }
        }
      }
      timeline.push(instruction2);

      var instruction2rep = {
        type:"audio-button-response",
        stimulus:'../aud/小宝宝叫了.mp3',
        prompt:
        function(){
                  var html = '<div style="font-size:24px;"><p>1. 回答错误，让我们再来一遍</p>'
                  html+="<img src='../img/练启动 叫 小宝宝.png'></img>";
                  return html;
              },
        choices:["是","否"],
        data: {test_part: 'instruction2', correct_response:0},
        on_finish: function(data) {
            if (data.button_pressed == data.correct_response) { // key press == correct response
                data.accuracy = 1
            } else { // key press != correct response
                data.accuracy = 0
            }
        }
      }

      var if_node3 = {
          timeline: [instruction2rep],
          conditional_function: function(){
              // get the data from the previous trial,
              // and check the accuracy
                var last_trial_accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
                if (last_trial_accuracy == 1) {
                  return false;
              } else {
                  return true;
              }
          }
      }
      timeline.push(if_node3);

      /* Instruction3*/
    var instruction3 = {
      type: 'instructions',
      pages: page2,
      show_clickable_nav: true,
      button_label_previous: "上一页",
      button_label_next: "下一页",
      data:{test_part: 'instruction3'}
    }
    timeline.push(instruction3);

    var instruction4 = {
        type: "image-audio-response",
        word: "叫",
        prompt:"老师_____。",
        stimulus: "../img/练目标 叫 老师.png",
        allow_playback: false,
        wait_for_mic_approval: true,
        buffer_length:6000,
        response_ends_trial:true,
        data:{test_part: 'instruction4'}
      }
        timeline.push(instruction4);

        var instruction5 = {
            type: "html-button-response",
            stimulus: page3,
            choices: ["练习开始"]
          };
    timeline.push(instruction5);

    // practice trials
    var practice_procedure = {
      timeline_variables: practice_stimuli,
      timeline: [
        {
          type:'html-keyboard-response',
          stimulus:'<div style="font-size:60px;">+</div>',
          choices:jsPsych.NO_KEYS,
          trial_duration:500,
          data:{test_part: 'fixation'}
        },
        {
          type:"audio-button-response",
          stimulus: function(){ return jsPsych.timelineVariable('audio', true);},
          prompt:
          function(){
                    var html="<img src='"+jsPsych.timelineVariable('ppic', true)+"'><br>";
                    return html;
                },
          choices:["是","否"],
          data: jsPsych.timelineVariable('data'),
          on_finish: function(data) {
              if (data.button_pressed == data.correct_response) { // key press == correct response
                  data.accuracy = 1
              } else { // key press != correct response
                  data.accuracy = 0
              }
          }
        },
        {
          type:'html-keyboard-response',
          stimulus:'<div style="font-size:60px;">+</div>',
          choices:jsPsych.NO_KEYS,
          trial_duration:500,
          data:{test_part: 'fixation'}
        },
        {
          type: "image-audio-response",
          word:
          function(){ return jsPsych.timelineVariable('tverb', true);},
          stimulus:function(){ return jsPsych.timelineVariable('tpic', true);},
          prompt:
          function(){ return "<div style='font-size:28px;'>"+"<p>"+ jsPsych.timelineVariable('tpre', true);+"</p>"+"</div>"},
          allow_playback: false,
          wait_for_mic_approval: true,
          buffer_length:6000,
          response_ends_trial:true,
          data:{test_part: 'targettask'},
        }
      ]
    }

        timeline.push(practice_procedure);

        var instruction6 = {
            type: "html-button-response",
            stimulus: page4,
            choices: ["实验正式开始"]
          };
    timeline.push(instruction6);

// Main test
var my_stimuli = [trial_stimuli1, trial_stimuli2, trial_stimuli3, trial_stimuli4, trial_stimuli5, trial_stimuli6, trial_stimuli7, trial_stimuli8,
                  trial_stimuli9, trial_stimuli10, trial_stimuli11, trial_stimuli12, trial_stimuli13, trial_stimuli14, trial_stimuli15, trial_stimuli16,
                  trial_stimuli17, trial_stimuli18, trial_stimuli19, trial_stimuli20, trial_stimuli21, trial_stimuli22, trial_stimuli23, trial_stimuli24];
var trial_stimuli = jsPsych.randomization.sampleWithReplacement(my_stimuli, 1)[0];

var test_procedure = {
  timeline_variables: trial_stimuli,
  timeline: [
    {
      type:'html-keyboard-response',
      stimulus:'<div style="font-size:60px;">+</div>',
      choices:jsPsych.NO_KEYS,
      trial_duration:500,
      data:{test_part: 'fixation'}
    },
    {
      type:"audio-button-response",
      stimulus: function(){ return jsPsych.timelineVariable('audio', true);},
      image:
      function(){ return jsPsych.timelineVariable('ppic', true);},
      choices:["是","否"],
      data: jsPsych.timelineVariable('data'),
      mirror: function(){
        return jsPsych.timelineVariable('mirror', true);
      },
      on_finish: function(data) {
          if (data.button_pressed == data.correct_response) { // key press == correct response
              data.accuracy = 1
          } else { // key press != correct response
              data.accuracy = 0
          }
      }
    },
    {
      type:'html-keyboard-response',
      stimulus:'<div style="font-size:60px;">+</div>',
      choices:jsPsych.NO_KEYS,
      trial_duration:500,
      data:{test_part: 'fixation'}
    },
    {
      type: "image-audio-response",
      word:
      function(){ return jsPsych.timelineVariable('tverb', true);},
      stimulus:function(){ return jsPsych.timelineVariable('tpic', true);},
      prompt:
      function(){ return "<div style='font-size:28px;'>"+"<p>"+ jsPsych.timelineVariable('tpre', true);+"</p>"+"</div>"},
      allow_playback: false,
      wait_for_mic_approval: true,
      buffer_length:6000,
      response_ends_trial:true,
      data:{test_part: 'targettask'},
      mirror: function(){
        return jsPsych.timelineVariable('mirror', true);
      }
    }
  ]
}

timeline.push(test_procedure);

      var goodbye = {
              type: "html-keyboard-response",
              stimulus: '<div style="font-size:24px;">实验结束，非常感谢您的参与!请按任意键结束。如有问题请联系实验员chi.zhang@ugent.be',
              choices: jsPsych.ALL_KEYS
      };
      timeline.push(goodbye)

    /* start the experiment */
    function startExp ()
    {jsPsych.init({
      timeline: timeline,
      on_interaction_data_update: function(data) {
            // get the main trial data
            var trial = jsPsych.currentTrial();
            trial.data.screen_focus = data.event;
        },
      preload_audio: audio,
      preload_images: image,
      use_webaudio: false,/*This should be deactivated in web testing*/
      on_finish: function() {
          $.ajax({
              type: "POST",
              url: "/experiment-data",
              data: JSON.stringify(jsPsych.data.get().values()),
              contentType: "application/json"
          }).done(function() {
              // window.location.href = "finish";
              setTimeout(function(){location.href="goodbye.html"}, 2000)
          }).fail(function() {
              alert("Problem occurred while writing data to Dropbox. " +
                  "Data will be saved to your computer. " +
                  "Please contact the experimenter regarding this issue!");
              var csv = jsPsych.data.get().csv();
              var filename = Part_ID + "_" + DATE + ".csv";
              downloadCSV(csv, filename);
              window.location.href = "finish";
          });
      }
  })
}
