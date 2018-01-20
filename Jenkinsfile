pipeline {
  agent {
    docker {
      image 'jenkinsci/slave'
    }
    
  }
  stages {
    stage('build docker') {
      steps {
        sh 'docker build .'
      }
    }
  }
}