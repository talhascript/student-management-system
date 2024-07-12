pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = credentials('ukhyam')
        DOCKER_HUB_PASSWORD = credentials('Alcatraz001#')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Flutter App') {
            steps {
                sh 'flutter build web' // or 'flutter build apk' or 'flutter build ios' depending on your target platform
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def appVersion = sh(returnStdout: true, script: 'cat pubspec.yaml | grep version | cut -d ":" -f 2').trim() 
                    def imageName = "your-dockerhub-username/your-app-name:${appVersion}"
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.build(imageName).push()
                    }
                }
            }
        }
    }
}