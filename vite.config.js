const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Htmls
        main: './index.html',
        pageHeader: './comp/page-header.html',
        pageFooter: './comp/page-footer.html',
        quizScreen: './comp/quiz-screen.html'
      }
    }
  },
  watch: {
      usePolling: true
  },
  base: '/myearthgame.github.io/'
})