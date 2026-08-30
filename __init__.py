"""Compatibility package for running this repository directly.

The repository and the application package are both named ``backend``.  When
pytest imports the repository as a package, expose the nested application
directory first so imports such as ``backend.quiz_engine`` remain stable.
"""

import os

_application_package = os.path.join(os.path.dirname(__file__), "backend")
if os.path.isdir(_application_package) and _application_package not in __path__:
    __path__.insert(0, _application_package)
