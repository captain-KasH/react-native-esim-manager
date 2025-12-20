#pragma once

#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>

namespace facebook {
namespace react {

class JSI_EXPORT EsimManagerTurbo : public TurboModule {
public:
  EsimManagerTurbo(std::shared_ptr<CallInvoker> jsInvoker);
};

} // namespace react
} // namespace facebook