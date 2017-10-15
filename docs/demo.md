<center><h2>validator.js 实验室</h2></center>
<vuep template="#example"></vuep>
<script v-pre type="text/x-template" id="example">
  <template>
    <div>
      <p>Hello, validator.js!</p>
      <p><b>fails</b>: {{fails}}</p>
      <p><b>msg</b>: {{msg}}</p>
      <b>all:</b>
      <p class="code">
        {{result}}
      </p>
      <button class="btn" @click="run">run</button>
    </div>
  </template>
  <script>
    var data = {
      name: 'validator',
      nickname: 'validator.js',
      password: '123456',
      confirm_password: '1234561'
    }
    var constraints = {
      name: [
        {required: true, msg: 'name字段不能为空'},
        {type: String, msg: 'name字段必须是字符串'},
        {length: [3, 20], msg: 'name字段保持3~20字符'},
      ],
      nickname: {length: [3, 20], msg: 'nickname字段保持3~20字符'},
      password: {required: true, not: '123456', min: 6, msg: 'password验证不通过'},
      confirm_password: {eq: data.password, msg: '两次输入密码不一致'}
    }
    module.exports = {
      data: {
        data: data,
        constraints: constraints,
        result: null,
        fails: null,
        msg: ''
      },
      methods: {
        run: function () {
          // console.log(this)
          var valid = validator.validate(this.data, this.constraints)
          console.log(valid)
          this.fails = valid.fails()
          this.msg = valid.first()
          this.result = valid.all()
        }
      }
    }
  </script>
</script>
