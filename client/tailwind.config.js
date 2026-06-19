export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { gold:'#D6A83A', dark:'#050505', soft:'#111111' },
    boxShadow: { gold:'0 0 35px rgba(214,168,58,.25)' },
    fontFamily: { display:['Georgia','serif'], body:['Inter','Arial','sans-serif'] }
  }},
  plugins: []
}
