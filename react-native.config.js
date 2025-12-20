module.exports = {
  dependencies: {
    'react-native-esim-manager': {
      platforms: {
        android: {
          sourceDir: '../android',
          packageImportPath: 'import com.esimmanager.EsimManagerPackage;',
        },
        ios: {
          project: 'EsimManager.xcodeproj',
        },
      },
    },
  },
};