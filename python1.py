import pickle
import sklearn.svm

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'sklearn.svm.classes' and name == 'SVC':
            return sklearn.svm.SVC
        return super().find_class(module, name)

with open('model.pkl', 'rb') as file:
    model = CustomUnpickler(file).load()
