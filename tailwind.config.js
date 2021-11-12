module.exports = {
  //mode: process.env.NODE_ENV && 'jit',
  //mode: process.env.NODE_ENV ? 'jit' : undefined,
  mode: '', // Just-In-Time Compiler
  purge: ['./src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      //sm: ['10px', '12px'],
      //base: ['16px', '24px'],
      //lg: ['20px', '28px'],
      //xl: ['24px', '32px'],
    },
    screens: {
      'sm': {'min': '384px'},
      'md': {'min': '868px'},
      'lg': {'min': '1290px'},
    },
    fontFamily: {
      'GothamProRegular': ['"GothamProRegular"'],
      'GothamProMedium': ['"GothamProMedium"'],
      'GothamProLight': ['"GothamProLight"'],
      'GothamProBold': ['"GothamProBold"'],
    },
  }
}
