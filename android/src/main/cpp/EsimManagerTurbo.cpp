#include "EsimManagerTurbo.h"

namespace facebook {
namespace react {

EsimManagerTurbo::EsimManagerTurbo(std::shared_ptr<CallInvoker> jsInvoker)
    : TurboModule("EsimManager", jsInvoker) {}

} // namespace react
} // namespace facebook