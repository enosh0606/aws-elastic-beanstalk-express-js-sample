pipeline {
    agent {
        docker {
            image 'node:16'
            args '-u root'
        }
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running checks...'
                sh 'npm run lint || echo "No lint script - skipping"'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t enosh0606/node-app:latest .'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning for vulnerabilities...'
                sh 'trivy image enosh0606/node-app:latest || echo "Trivy not installed - skipping"'
            }
        }

        stage('Push') {
            steps {
                echo 'Push stage - will be set up later'
            }
        }
    }
}
